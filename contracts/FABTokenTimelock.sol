pragma solidity 0.4.25;

import "openzeppelin-solidity/contracts/token/ERC20/TokenTimelock.sol";
import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";

/**
 * @title Token timelock contract.
 * Is a derivation of the OpenZeppeling TokenTimelock contract
 * with a very small addition to Log the timelock event as a record that the operation
 * was done.
 */
contract FABTokenTimelock is TokenTimelock{
  using SafeERC20 for ERC20Basic;
  event LogTimelock(address sender, address beneficiary, uint256 releaseTime);

  constructor(ERC20Basic _token, address _beneficiary, uint _releaseTime)
    TokenTimelock(_token, _beneficiary, _releaseTime)
    public
  {
    emit LogTimelock(msg.sender, _beneficiary, _releaseTime);
  }
}
