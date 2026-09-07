import { Component } from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  name: string;
  index: number;
  isActive: boolean;
  defaultActiveIndex: number;
  onClick: (index: number) => void;
}

class Navbar extends Component<NavbarProps> {
  componentDidMount() {
    const activeIndexFromStorage = sessionStorage.getItem('activeIndex');
    const activeIndex = activeIndexFromStorage !== null ? parseInt(activeIndexFromStorage) : this.props.defaultActiveIndex;

    if (this.props.index === activeIndex) {
      this.props.onClick(this.props.index);
    }
  }

  handleClick = () => {
    this.props.onClick(this.props.index);
    sessionStorage.setItem('activeIndex', this.props.index.toString());
  };

  render() {
    return (
      <Link to={`/${this.props.name}`}>
        <li
          className={this.props.isActive ? 'active' : ''}
          onClick={this.handleClick}
        >
          {this.props.name}
        </li>
      </Link>
    );
  }
}

export default Navbar;
