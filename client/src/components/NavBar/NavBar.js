import React, { useState } from 'react';
import {notify} from 'react-notify-toast';
import { Card, Button, Modal, Input } from 'kc-react-widgets';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdContentPaste, MdLink, MdPrint } from "react-icons/md";
import logo from './logo.png';
import './NavBar.css';

function NavBar() {
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);

  // Shorthand syntax for declaring single-line functions:
  const openSaveModal = () => setIsSaveModalVisible(true);
  const closeSaveModal = () => setIsSaveModalVisible(false);

  const loc = String(window.location).toLowerCase();
  const locDisplay = loc.replace('http://', '').replace('https://', '');

  function copySuccessful() {
    notify.show('Copied to clipboard. Share this by pasting it somewhere!');
  }

  function showPrintDialog() {
    // Built-in to browsers for the longest time, just have to invoke
    // window.print to show the print dialog!
    window.print();
  }

  return (
    <div className="NavBar">
      <Card depth="towering">
        <img src={logo} className="NavBar-logo" />
        <h1 className="NavBar-title">Cash Flow Calc</h1>
        <div className="NavBar-buttons">
          <CopyToClipboard text={loc} onCopy={copySuccessful}>
            <Button depth="flat" size="small">
              <MdLink />
              {locDisplay}
              <MdContentPaste />
              </Button>
          </CopyToClipboard>

          <Button onClick={showPrintDialog}>
            <MdPrint /> Print
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default NavBar;
