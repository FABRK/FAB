pragma solidity 0.4.25;

import "openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/BasicToken.sol";


/**
 * @title ERC20 Token for the FAB Tokensale.
 * Is a Standard, Pausable and Burnable ERC20 token
 * Contains additional logic to register FAB addresses
 * and claim tokens for the FAB Mainnet swap.
 */
contract FABToken is StandardToken, DetailedERC20{
  mapping(address => string) public keys;
  event LogRegister(address user, string key);
  event LogClaim(address indexed claimer, string fabAddress, uint256 tokenCount);

  constructor(string _name, string _symbol, uint8 _decimals)
    DetailedERC20(_name, _symbol, _decimals)
    public
  {
    totalSupply_ = 55000000000;
    balances[msg.sender] = totalSupply_;
    emit Transfer(address(0), msg.sender, totalSupply_);
  }
}
