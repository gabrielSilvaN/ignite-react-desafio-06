import Prismic from '@prismicio/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import { BiTime } from 'react-icons/bi';
import { BsCalendar, BsPerson } from 'react-icons/bs';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
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
  total_time: string;
}

interface PostProps {
  post: Post;
}

const Post: React.FC<PostProps> = ({ post }) => {
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
            {post.first_publication_date}
          </span>

          <span>
            <BsPerson size={20} />
            {post.data.author}
          </span>

          <span>
            <BiTime size={20} />
            {post.total_time}
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

export const getStaticPaths: GetStaticPaths = async params => {
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
  const { first_publication_date, data } = await prismic.getByUID(
    'posts',
    String(slug),
    {}
  );

  const totalTime = data.content.reduce((acc, current) => {
    const total = current.body.reduce((acc2, current2) => {
      return acc2 + current2.text.split(' ').length;
    }, 0);
    return acc + current.heading.split(' ').length + total;
  }, 0);

  const post = {
    first_publication_date: format(
      new Date(first_publication_date),
      'dd LLL yyyy',
      {
        locale: ptBR,
      }
    ),
    data: {
      title: data.title,
      banner: {
        url: data.banner.url,
      },
      author: data.author,
      content: data.content,
    },
    total_time: `${Math.ceil(totalTime / 200)} min`,
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60,
  };
};
