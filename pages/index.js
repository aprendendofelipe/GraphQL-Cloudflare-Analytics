import { explorerPlugin } from '@graphiql/plugin-explorer';
import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import '@graphiql/plugin-explorer/dist/style.css';
import 'graphiql/graphiql.css';

const explorer = explorerPlugin();

export default () => {
  const { data: session, status } = useSession();
  const [fetcher, setFetcher] = useState();
  const router = useRouter();

  useEffect(() => {
    setFetcher(() =>
      createGraphiQLFetcher({
        url: '/api/graphql',
      })
    );
  }, []);

  if (fetcher && session) return <GraphiQL fetcher={fetcher} plugins={[explorer]} />;

  if (status === 'loading') return <div>Loading...</div>;

  if (status !== 'authenticated') {
    router.push('/api/auth/signin');
    return <div>Redirecting...</div>;
  }
};
