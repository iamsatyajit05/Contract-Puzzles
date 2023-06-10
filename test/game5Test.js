const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();
    
    const signer = ethers.provider.getSigner(0);

    return { game, signer };
  }
  it('should be a winner', async function () {
    const { game, signer} = await loadFixture(deployContractAndSetVariables);

    // good luck
    let wallet = ethers.Wallet.createRandom();
    const threshold = 0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf;

    while(wallet.address >= threshold) {
      wallet = ethers.Wallet.createRandom();
    }

    let finalSigner = wallet.connect(ethers.provider);

    const tx = {
      to: finalSigner.address,
      value: ethers.utils.parseEther("1")
    }
    await signer.sendTransaction(tx);

    await game.connect(finalSigner).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
