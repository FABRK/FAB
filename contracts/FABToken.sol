pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

/**
 * @title ERC20 Token for the FAB Tokensale.
 * Is a Standard ERC20 token
 */
contract FABToken is ERC20, ERC20Detailed{
  constructor(string memory _name, string memory _symbol, uint8 _decimals)
    ERC20Detailed(_name, _symbol, _decimals)
    public
  {
    _mint(msg.sender, 55000000000000000000000000000);
  }
}
