import { Link } from "react-router-dom";
import "./NematodeList.css";

export default function NematodeList({ letter, items }) {
  return (
    <section className="nematode-list">
      <h2 className="nematode-list__letter">{letter}</h2>
      <ul className="nematode-list__list">
        {items.map((item) => (
          <li key={item.name} className="nematode-list__item">
            <Link to={`/nematode/${encodeURIComponent(item.name)}`}>
              {item.name}
            </Link>
            <span className="nematode-list__count">({item.count})</span>

            {item.children && item.children.length > 0 && (
              <ul className="nematode-list__sublist">
                {item.children.map((child) => (
                  <li key={child.name} className="nematode-list__subitem">
                    <Link to={`/nematode/${encodeURIComponent(child.name)}`}>
                      {child.name}
                    </Link>
                    <span className="nematode-list__count">
                      ({child.count})
                    </span>
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
