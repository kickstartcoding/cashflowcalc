import React from 'react';
import { notify } from 'react-notify-toast';
import { Card, Button } from 'kc-react-widgets';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdContentPaste, MdLink, MdPrint } from "react-icons/md";
import logo from './logo.png';
import './NavBar.css';

function NavBar() {
  const loc = String(window.location).toLowerCase();
  const locDisplay = loc.replace('http://', '').replace('https://', '');

  function copySuccessful() {
    notify.show('Copied to clipboard. Share this by pasting it somewhere!');
  }

  function showPrintDialog() {
    // The window.print() function has been built-in to browsers for the
    // longest time. Just have to invoke it to show the print dialog!
    window.print();
  }

  return (
    <div className="NavBar">
      <Card depth="towering">
        <img src={logo} className="NavBar-logo" alt="Cash Flow Calc Logo" />
        <h1 className="NavBar-title">Cash Flow Calc</h1>
        {/*
        <Link to="/">
          <Button size="small">New</Button>
        </Link>
        */}
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
