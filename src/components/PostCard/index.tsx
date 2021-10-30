import { BsPerson, BsCalendar } from 'react-icons/bs';
import styles from './styles.module.scss';

interface PostCardProps {
  title: string;
  subtitle: string;
  date: string;
  author: string;
}

const PostCard: React.FC<PostCardProps> = ({
  author,
  date,
  subtitle,
  title,
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.subtitle}>{subtitle}</p>

      <div className={styles.info}>
        <span>
          <BsCalendar size={20} />
          {date}
        </span>

        <span>
          <BsPerson size={20} />
          {author}
        </span>
      </div>
    </div>
  );
};

export default PostCard;
