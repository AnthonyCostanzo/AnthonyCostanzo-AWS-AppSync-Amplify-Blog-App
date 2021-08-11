import './App.css';
import DisplayPosts from './components/displayPosts';
import CreatePost from './components/createPost';
function App() {
  return (
    <div className="App">
      <CreatePost/>
      <DisplayPosts/>
    </div>
  );
}

export default App;
