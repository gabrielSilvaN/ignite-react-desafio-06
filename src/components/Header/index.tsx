import Link from 'next/link';
import styles from './header.module.scss';

const Header: React.FC = () => {
  return (
    <header>
      <div className={styles.content}>
        <Link href="/">
          <a>
            <img src="/logo.svg" alt="logo" />
          </a>
        </Link>
      </div>
    </header>
  );
};

export { Header };
export default Header;
