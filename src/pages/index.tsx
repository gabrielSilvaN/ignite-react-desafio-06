import Prismic from '@prismicio/client';
import { GetStaticProps } from 'next';
import PostCard from '../components/PostCard';
import { getPrismicClient } from '../services/prismic';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

const Home: React.FC<HomeProps> = ({ postsPagination }) => {
  return (
    <div className={styles.content}>
      {postsPagination.results.map(post => (
        <PostCard
          key={post.uid}
          author={post.data.author}
          date={post.first_publication_date}
          subtitle={post.data.subtitle}
          title={post.data.title}
        />
      ))}
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: [
        'posts.title',
        'posts.subtitle',
        'posts.author',
        'posts.banner',
        'posts.content',
      ],
      pageSize: 100,
    }
  );

  return {
    props: {
      postsPagination: {
        results: postsResponse.results.map(post => ({
          uid: post.uid,
          first_publication_date: post.first_publication_date,
          data: {
            title: post.data.title,
            subtitle: post.data.subtitle,
            author: post.data.author,
          },
        })),
        next_page: postsResponse.next_page,
      },
    },
    revalidate: 60 * 60, // 1 hours
  };
};
