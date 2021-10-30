import styles from './header.module.scss';

const Header: React.FC = () => {
  return (
    <header>
      <div className={styles.content}>
        <img src="/logo.svg" alt="logo" />
      </div>
    </header>
  );
};

export { Header };
