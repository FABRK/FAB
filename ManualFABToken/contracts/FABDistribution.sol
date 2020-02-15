pragma solidity ^0.4.24;

import './interfaces/IERC20.sol';
import './SafeMath.sol';
import './Ownable.sol';
/**
 * @title FAB token initial distribution
 *
 * @dev Distribute purchasers, airdrop, reserve, and founder tokens
 */
contract FABDistribution is Ownable {
  using SafeMath for uint256;
  //using SafeERC20 for IERC20;
  // IERC20 private FAB;
  IERC20 private FAB;
  uint256 private constant decimalFactor = 10**uint256(18);
  uint256 public AVAILABLE_AIRDROP_SUPPLY  =   10000000 * decimalFactor; // 100% Released at TD
  uint256 public grandTotalClaimed = 0;
  uint256 public startTime;
  // List of admins
  mapping (address => bool) public airdropAdmins;
  // Keeps track of whether or not an airdrop has been made to a particular address
  mapping (address => bool) public airdrops;

  modifier onlyOwnerOrAdmin() {
    require(msg.sender == owner || airdropAdmins[msg.sender]);
    _;
  }

  function FABDistribution(IERC20 token, uint256 _startTime) public {
    FAB = token;
    startTime = _startTime;
  }

  function token() public view returns (IERC20) {
    return FAB;
  }

  function setAirdropAdmin(address _admin, bool _isAdmin) public onlyOwner {
    airdropAdmins[_admin] = _isAdmin;
  }

  function airdropTokens(address[] _recipient, uint256[] _amount) public onlyOwnerOrAdmin {
    // require(now >= startTime);
    uint airdropped;
    for(uint256 i = 0; i< _recipient.length; i++)
    {
        if (!airdrops[_recipient[i]]) {
          airdrops[_recipient[i]] = true;
          require(FAB.transfer(_recipient[i], _amount[i] * decimalFactor));
          airdropped = airdropped.add(_amount[i] * decimalFactor);
        }
    }
    AVAILABLE_AIRDROP_SUPPLY = AVAILABLE_AIRDROP_SUPPLY.sub(airdropped);
    grandTotalClaimed = grandTotalClaimed.add(airdropped);
  }

  function transferTokens (address _recipient, uint256 amount) public onlyOwnerOrAdmin {
    uint256 tokensToTransfer = amount * decimalFactor;
    require(FAB.transfer(_recipient, tokensToTransfer ));
    grandTotalClaimed = grandTotalClaimed.add( tokensToTransfer );
  }

  // Returns the amount of FAB allocated
  function grandTotalAllocated() public view returns (uint256) {
    return grandTotalClaimed / decimalFactor;
  }

}
