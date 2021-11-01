import { BsPerson, BsCalendar } from 'react-icons/bs';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import styles from './styles.module.scss';
import common from '../../styles/common.module.scss';

interface PostCardProps {
  title: string;
  subtitle: string;
  date: string;
  author: string;
  slug: string;
}

const PostCard: React.FC<PostCardProps> = ({
  author,
  date,
  subtitle,
  title,
  slug,
}) => {
  const formatedDate = format(new Date(date), 'dd LLL yyyy', {
    locale: ptBR,
  });

  return (
    <Link href={`post/${slug}`}>
      <a className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>

        <div className={common.info}>
          <span>
            <BsCalendar size={20} />
            {formatedDate}
          </span>

          <span>
            <BsPerson size={20} />
            {author}
          </span>
        </div>
      </a>
    </Link>
  );
};

export default PostCard;
