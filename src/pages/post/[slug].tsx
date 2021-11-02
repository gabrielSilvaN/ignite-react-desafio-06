import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { BiTime } from 'react-icons/bi';
import { BsCalendar, BsPerson } from 'react-icons/bs';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { isFallback } = useRouter();

  if (isFallback) return <h1>Carregando...</h1>;

  const formatedDate = format(
    new Date(post.first_publication_date),
    'dd LLL yyyy',
    {
      locale: ptBR,
    }
  );

  const totalWords = post.data.content.reduce((acc, current) => {
    const total = current.body.reduce((acc2, current2) => {
      return acc2 + current2.text.split(' ').length;
    }, 0);
    return acc + current.heading.split(' ').length + total;
  }, 0);

  const readTime = `${Math.ceil(totalWords / 200)} min`;

  return (
    <div>
      <img
        className={styles.banner}
        src={post.data.banner.url}
        alt="Post Banner"
      />
      <div className={commonStyles.content}>
        <h1 className={styles.title}>{post.data.title}</h1>

        <div className={`${commonStyles.info} ${styles.infoPost}`}>
          <span>
            <BsCalendar size={20} />
            {formatedDate}
          </span>

          <span>
            <BsPerson size={20} />
            {post.data.author}
          </span>

          <span>
            <BiTime size={20} />
            {readTime}
          </span>
        </div>

        {post.data.content.map(content => (
          <div key={content.heading}>
            <h2 className={styles.subtitle}>{content.heading}</h2>
            {content.body.map(body => (
              <p key={body.text} className={styles.text}>
                {body.text}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.content'],
      pageSize: 100,
    }
  );

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const { first_publication_date, data, uid } = await prismic.getByUID(
    'posts',
    String(slug),
    {}
  );

  const post = {
    first_publication_date,
    uid,
    data: {
      title: data.title,
      subtitle: data.subtitle,
      banner: {
        url: data.banner.url,
      },
      author: data.author,
      content: data.content,
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60,
  };
};
