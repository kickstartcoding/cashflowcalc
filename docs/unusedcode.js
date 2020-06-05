

// From: https://www.npmjs.com/package/react-share
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TumblrShareButton,
  TwitterShareButton,
} from "react-share";

import {
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  RedditIcon,
  TumblrIcon,
  TwitterIcon,
} from "react-share";


function saveModalContents() {
  // Modal contents 
  // Get the current URL to use for the share buttons
  const shareUrl = window.location.href;
  const shareIconSize = 50;
  // Eventually should include: https://react-pdf.org/repl
  return (
    <div>
      Share the link:
      <EmailShareButton url={shareUrl}>
        <EmailIcon size={shareIconSize} />
      </EmailShareButton>

      <FacebookShareButton url={shareUrl}>
        <FacebookIcon size={shareIconSize} />
      </FacebookShareButton>

      <LinkedinShareButton url={shareUrl}>
        <LinkedinIcon size={shareIconSize} />
      </LinkedinShareButton>

      <TwitterShareButton url={shareUrl}>
        <TwitterIcon size={shareIconSize} />
      </TwitterShareButton>

      <TumblrShareButton url={shareUrl}>
        <TumblrIcon size={shareIconSize} />
      </TumblrShareButton>

      <RedditShareButton url={shareUrl}>
        <RedditIcon size={shareIconSize} />
      </RedditShareButton>

      <Button depth="shallow" onClick={openSaveModal}>
        Share
      </Button>
      <Modal bareChildren={true} visible={isSaveModalVisible} onBackdropClick={closeSaveModal}>
        <Card type="primary">Modal title</Card>
        <Card>
          {saveModalContents()}
        </Card>
        <Card>
          <Button>Okay</Button>
        </Card>
      </Modal>
    </div>
    )
}

