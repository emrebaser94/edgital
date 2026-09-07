import { Component } from 'react';
import Navbar from './Navbar';

interface Clickable {
  name: string;
}

interface HeaderState {
  activeIndex: number | null;
}

class Header extends Component<{}, HeaderState> {
  state: HeaderState = {
    activeIndex: null
  };

  handleClick = (index: number) => {
    this.setState({ activeIndex: index });
  };

  render() {
    const clickables: Clickable[] = [
      { name: "Roads" },
      { name: "Overview" },
      { name: "Statistics" },
      { name: "Todos" }
    ];

    return (
      <div className="header">
        <div className="left-content">
          <img src="src/assets/map.svg" alt="Road Overview" />
          <span className='text-xl'>ROAD OVERVIEW</span>
        </div>
        <ul>
          {clickables.map((clickable, i) => (
            <Navbar
              key={clickable.name}
              name={clickable.name}
              index={i}
              isActive={this.state.activeIndex === i}
              defaultActiveIndex={0}
              onClick={this.handleClick}
            />
          ))}
        </ul>
      </div>

    );
  }
}

export default Header;
