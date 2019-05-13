pragma solidity 0.4.25;

import "openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/BasicToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/PausableToken.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";


contract FABToken is StandardToken, DetailedERC20, Ownable, PausableToken{
  mapping(address => string) public keys;
  event LogRegister(address user, string key);

  constructor(string _name, string _symbol, uint8 _decimals)
    DetailedERC20(_name, _symbol, _decimals)
    public
  {
    totalSupply_ = 55000000000;
    balances[msg.sender] = totalSupply_;
  }

  function register(string _fabAddress) public whenNotPaused returns (bool) {
    require(balances[msg.sender] > 0, "Balance must be > 0");
    keys[msg.sender] = _fabAddress; // set FAB address
    emit LogRegister(msg.sender, key);
  }
}
