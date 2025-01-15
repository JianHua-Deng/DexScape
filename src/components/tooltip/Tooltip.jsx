import { useState } from 'react';
import './Tooltip.css';

function Tooltip({ content, direction, children }) {
  const [show, setShow] = useState(false);

  return (
    <div
        className="tooltip-container"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
    >
        {children}
        {show && content && <div className={`tooltip ${direction}`}>{content}</div>}
    </div>
  );
}

export default Tooltip;