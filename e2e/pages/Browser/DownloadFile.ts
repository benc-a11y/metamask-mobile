import Matchers from '../../framework/Matchers.ts';
import Assertions from '../../framework/Assertions.ts';
import { waitFor } from 'detox';

class DownloadFile {
  async verifyTapjackingAndClickDownloadButton(): Promise<void> {
    const downloadButtonInDialog =
      device.getPlatform() === 'android'
        ? Matchers.getElementByText('Download')
        : Matchers.getElementByLabel('Download');
    await Assertions.expectElementToBeVisible(downloadButtonInDialog, {
      timeout: 2000,
      description: 'Download button should be visible and enabled',
    });
    await (await downloadButtonInDialog).tap();
  }

  async verifySuccessStateVisible(): Promise<void> {
    if (device.getPlatform() === 'ios') {
      // Verify for iOS that system file saving dialog is visible
      waitFor(await Matchers.getElementByLabel('Save')).toExist();
    } else {
      // Verify for Android that toast after successful downloading is visible
      waitFor(
        await Matchers.getElementByText('Downloaded successfully'),
      ).toExist();
    }
  }
}

export default new DownloadFile();
