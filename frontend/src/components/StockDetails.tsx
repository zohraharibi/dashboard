import React from 'react';

const StockDetails: React.FC = () => {
  return (
    <div>
      <div className="row mb-2">
        <div className="col-6">
          <h6 className="main-block-section-title">Stats</h6>
          <table className="table table-sm table-borderless main-block-stats-table">
            <tbody>
              <tr>
                <td className="text-muted ps-0">OPEN</td>
                <td className="text-end pe-0">1010.55</td>
              </tr>
              <tr>
                <td className="text-muted ps-0">HIGH</td>
                <td className="text-end pe-0">1048.00</td>
              </tr>
              <tr>
                <td className="text-muted ps-0">LOW</td>
                <td className="text-end pe-0">1004.04</td>
              </tr>
              <tr>
                <td className="text-muted ps-0">VOLUME</td>
                <td className="text-end pe-0">1.19M</td>
              </tr>
              <tr>
                <td className="text-muted ps-0">AVG VOLUME</td>
                <td className="text-end pe-0">1.75M</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-6 stats-about-separator">
          <h6 className="main-block-section-title">About</h6>
          <div className="text-muted mb-1 main-block-about-text">
            <p className="mb-1">Alphabet, Inc. is a holding company, which engages in the business of acquisition and operation of different companies. It operates through the Google and Other Bets segments. The Google segment includes its main internet products such as Search, Ads, Commerce, Maps, YouTube, Apps, Cloud, Android, Chrome, Google Play as well as hardware products, such as...</p>
          </div>
          <table className="table table-sm table-borderless main-block-stats-table">
            <tbody>
              <tr>
                <td className="text-muted ps-0">52 WK HIGH</td>
                <td className="text-end pe-0">1198.00</td>
              </tr>
              <tr>
                <td className="text-muted ps-0">52 WK LOW</td>
                <td className="text-end pe-0">N/A</td>
              </tr>
              <tr>
                <td className="text-muted ps-0">DIVIDEND</td>
                <td className="text-end pe-0">$34.60</td>
              </tr>
              <tr>
                <td className="text-muted ps-0">MKT CAP</td>
                <td className="text-end pe-0">720.59B</td>
              </tr>
              <tr>
                <td className="text-muted ps-0">P/E RATIO</td>
                <td className="text-end pe-0">57.74</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockDetails;
