// src/components/NematodeList.jsx
import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import './NematodeList.css';

export default function NematodeList({ letter, items }) {
  return (
    <section className="nematode-list">
      <h2 className="nematode-list__letter">{letter}</h2>
      <ul className="nematode-list__list">
        {items.map(item => (
          <li key={item.name} className="nematode-list__item">
            {/* name + count */}
            {item.name} <span className="nematode-list__count">({item.count})</span>

            {/* if this item has children, render a nested UL */}
            {item.children && item.children.length > 0 && (
              <ul className="nematode-list__sublist">
                {item.children.map(child => (
                  <li key={child.name} className="nematode-list__subitem">
                    {child.name} <span className="nematode-list__count">({child.count})</span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
