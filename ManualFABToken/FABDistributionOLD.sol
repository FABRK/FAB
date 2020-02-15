pragma solidity ^0.4.24;

import './interfaces/IERC20.sol';
//import './FABToken.sol';
import './SafeMath.sol';
import './Ownable.sol';

//import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";

/**
 * @title FAB token initial distribution
 *
 * @dev Distribute purchasers, airdrop, reserve, and founder tokens
 */
contract FABDistribution is Ownable {
  using SafeMath for uint256;

  //using SafeERC20 for IERC20;

  // ERC20 basic token contract being held
  //IERC20 private FAB;

  //ManualToken private FAB;
  IERC20 private _token;

  // PolyToken public POLY;
  uint256 private constant decimalFactor = 10**uint256(18);
  //enum AllocationType { PRESALE, FOUNDER, AIRDROP, ADVISOR, RESERVE, BONUS1, BONUS2, BONUS3 }
  //uint256 public constant INITIAL_SUPPLY   = 55000000000 * decimalFactor;
  //uint256 public AVAILABLE_TOTAL_SUPPLY    = 55000000000 * decimalFactor;
  uint256 public AVAILABLE_AIRDROP_SUPPLY  =   10000000 * decimalFactor; // 100% Released at TD
  uint256 public grandTotalClaimed = 0;
  uint256 public startTime;

  // Allocation with vesting information
  struct Allocation {
    uint8 AllocationSupply; // Type of allocation
    // uint256 endCliff;       // Tokens are locked until
    // uint256 endVesting;     // This is when the tokens are fully unvested
    uint256 totalAllocated; // Total tokens allocated
    uint256 amountClaimed;  // Total tokens claimed
  }
  mapping (address => Allocation) public allocations;

  // List of admins
  mapping (address => bool) public airdropAdmins;

  // Keeps track of whether or not a 250 FAB airdrop has been made to a particular address
  mapping (address => bool) public airdrops;

  modifier onlyOwnerOrAdmin() {
    require(msg.sender == owner || airdropAdmins[msg.sender]);
    _;
  }

  // event LogFABClaimed(address indexed _recipient, uint8 indexed _fromSupply, uint256 _amountClaimed, uint256 _totalAllocated, uint256 _grandTotalClaimed);

  /**
    * @dev Constructor function - Set the FAB token address
    * @param _startTime The time when FABDistribution goes live
    */
  function FABDistribution(IERC20 token, uint256 _startTime) public {
    // require(_startTime >= now);
    // require(AVAILABLE_TOTAL_SUPPLY == AVAILABLE_PRESALE_SUPPLY
    //   .add(AVAILABLE_FOUNDER_SUPPLY)
    //   .add(AVAILABLE_AIRDROP_SUPPLY)
    //   .add(AVAILABLE_ADVISOR_SUPPLY)
    //   .add(AVAILABLE_BONUS1_SUPPLY)
    //   .add(AVAILABLE_BONUS2_SUPPLY)
    //   .add(AVAILABLE_BONUS3_SUPPLY)
    // );
    _token = token;
    startTime = _startTime;
    FAB = token;
  }

  function token() public view returns (IERC20) {
    return _token;
  }

  /**
    * @dev Add an airdrop admin
    */
  function setAirdropAdmin(address _admin, bool _isAdmin) public onlyOwner {
    airdropAdmins[_admin] = _isAdmin;
  }

  /**
    * @dev perform a transfer of allocations
    * @param _recipient is a list of recipients
    */
  function airdropTokens(address[] _recipient, uint256 amount) public onlyOwnerOrAdmin {
    // require(now >= startTime);
    uint airdropped;
    for(uint256 i = 0; i< _recipient.length; i++)
    {
        if (!airdrops[_recipient[i]]) {
          airdrops[_recipient[i]] = true;
          require(_token.transfer(_recipient[i], amount * decimalFactor));
          airdropped = airdropped.add(amount * decimalFactor);
        }
    }
    AVAILABLE_AIRDROP_SUPPLY = AVAILABLE_AIRDROP_SUPPLY.sub(airdropped);
    //AVAILABLE_TOTAL_SUPPLY = AVAILABLE_TOTAL_SUPPLY.sub(airdropped);
    grandTotalClaimed = grandTotalClaimed.add(airdropped);
  }

  /**
    * @dev Transfer a recipients available allocation to their address
    * @param _recipient The address to withdraw tokens for
    */
  function transferTokens (address _recipient, uint256 amount) public onlyOwnerOrAdmin {
    // require(allocations[_recipient].amountClaimed < allocations[_recipient].totalAllocated);
    // require(now >= allocations[_recipient].endCliff);
    // require(now >= startTime);
    // uint256 newAmountClaimed;
    // if (allocations[_recipient].endVesting > now) {
    //   // Transfer available amount based on vesting schedule and allocation
    //   newAmountClaimed = allocations[_recipient].totalAllocated.mul(now.sub(startTime)).div(allocations[_recipient].endVesting.sub(startTime));
    // } else {
    //   // Transfer total allocated (minus previously claimed tokens)
    //   newAmountClaimed = allocations[_recipient].totalAllocated;
    // }

    // Transfer total allocated (minus previously claimed tokens)
    // newAmountClaimed = allocations[_recipient].totalAllocated;
    uint256 tokensToTransfer = amount * decimalFactor;
    // allocations[_recipient].amountClaimed += tokensToTransfer;
    require(_token.transfer(_recipient, tokensToTransfer));
    grandTotalClaimed = grandTotalClaimed.add(tokensToTransfer);
    // LogFABClaimed(_recipient, allocations[_recipient].AllocationSupply, tokensToTransfer, allocations[_recipient].amountClaimed, grandTotalClaimed);
  }

  // Returns the amount of FAB allocated
  function grandTotalAllocated() public view returns (uint256) {
    return grandTotalClaimed / decimalFactor;
  }

  // Allow transfer of accidentally sent ERC20 tokens
  // function refundTokens(address _recipient, address _token) public onlyOwner {
  //   require(_token != address(FAB));
  //   IERC20 token = IERC20(_token);
  //   uint256 balance = token.balanceOf(this);
  //   require(token.transfer(_recipient, balance));
  // }
}
