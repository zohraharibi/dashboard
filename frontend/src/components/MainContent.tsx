import React from 'react';
import MainBlock from './MainBlock';
import SideBlock from './SideBlock';

const MainContent: React.FC = () => {
  return (
    <div className="row g-0 h-100">
      <div className="col-md-8 col-lg-9 ">
        <MainBlock />
      </div>
            <div className="col-md-4 col-lg-3 ps-2">
        <SideBlock />
      </div>
    </div>
  );
};

export default MainContent;
