"use client";

import { useState } from "react";
import { RiArrowUpSLine, RiArrowDownSLine } from "react-icons/ri";

// One open panel at a time, tracked by index. `null` means all closed, which is
// the state the page loads in.
export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="faq__wrapper">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div className={`faq${open ? " faq--open" : ""}`} key={item.question}>
            <button
              type="button"
              className="faq__title--wrapper"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span className="faq__title">{item.question}</span>
              <span className="faq__icon">{open ? <RiArrowUpSLine /> : <RiArrowDownSLine />}</span>
            </button>
            {/* Kept in the DOM and collapsed with max-height so the panel can
                animate; display:none would jump open with no transition. */}
            <div className="faq__answer--wrapper">
              <div className="faq__answer">{item.answer}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
