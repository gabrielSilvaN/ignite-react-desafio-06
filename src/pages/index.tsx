import Prismic from '@prismicio/client';
import { GetStaticProps } from 'next';
import { useState } from 'react';
import PostCard from '../components/PostCard';
import { getPrismicClient } from '../services/prismic';
import common from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  slug: string;
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
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);

  async function handleLoadNewPosts(): Promise<void> {
    const result = await fetch(postsPagination.next_page);
    console.log(result);
  }

  return (
    <div className={common.content}>
      {posts.map(post => (
        <PostCard
          key={post.uid}
          author={post.data.author}
          date={post.first_publication_date}
          subtitle={post.data.subtitle}
          title={post.data.title}
          slug={post.uid}
        />
      ))}

      {postsPagination.next_page && (
        <button
          type="button"
          onClick={handleLoadNewPosts}
          className={styles.buttonLoadMorePosts}
        >
          Carregar mais posts
        </button>
      )}
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const { next_page, results } = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 2,
    }
  );

  return {
    props: {
      postsPagination: {
        results: results.map(post => ({
          uid: post.uid,
          first_publication_date: post.first_publication_date,
          slug: post.uid,
          data: {
            title: post.data.title,
            subtitle: post.data.subtitle,
            author: post.data.author,
          },
        })),
        next_page,
      },
    },
    revalidate: 60 * 60, // 1 hours
  };
};
