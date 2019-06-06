pragma solidity 0.5.8;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

/**
 * @title ERC20 Token for the FAB Tokensale.
 * Is a Standard, Pausable and Burnable ERC20 token
 * Contains additional logic to register FAB addresses
 * and claim tokens for the FAB Mainnet swap.
 */
contract FABToken is ERC20, ERC20Detailed{
  constructor(string memory _name, string memory _symbol, uint8 _decimals)
    ERC20Detailed(_name, _symbol, _decimals)
    ERC20()
    public
  {
    _mint(msg.sender, 55000000000000000000000000000);
  }
}
