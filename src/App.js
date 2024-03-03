import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements
} from 'react-router-dom';
import { MainList, mainListLoader } from './pages/MainList';
import { Post, postLoader } from './pages/Post';

const ErrorTemplate = () => {
    return (
        <div>
            Something get wrong!
        </div>
    );
};

const router = createBrowserRouter(createRoutesFromElements(
    <Route path="/">
        <Route index element={<MainList />} loader={mainListLoader} errorElement={<ErrorTemplate />} />
        <Route path="/add-post" element={<Post />} errorElement={<ErrorTemplate />} />
        <Route path="/post/:id/:readOnly" element={<Post />} loader={postLoader} errorElement={<ErrorTemplate />} />
        <Route path="*" element={<MainList />} errorElement={<ErrorTemplate />} />
    </Route>
));

function App() {
  return (
      <RouterProvider router={router}/>
  );
}

export default App
