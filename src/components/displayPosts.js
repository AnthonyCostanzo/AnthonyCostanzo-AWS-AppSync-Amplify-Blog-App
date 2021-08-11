import React,{Component} from 'react';
import {listPosts} from '../graphql/queries';
import {onCreatePost} from '../graphql/subscriptions';
import {API, graphqlOperation} from 'aws-amplify';
import DeletePost from './deletePost';
import EditPost from './editPost';


class DisplayPosts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        }
    }

    componentDidMount = async () => {
        await this.getPosts();
        this.createPostListener = API.graphql(graphqlOperation(onCreatePost)).subscribe({
            next: postData => {
                const newPost = postData.value.data.onCreatePost;
                const prevPosts = this.state.posts.filter(post => post.id !== newPost.id);
                const updatedPosts = [newPost,...prevPosts];
                this.setState({posts:updatedPosts})
            }
        })
    }

    componentWillUnmount() {
        this.createPostListener.unsubscribe();
    }

    getPosts = async () => {
        const result = await API.graphql(graphqlOperation(listPosts));
        this.setState({posts: result.data.listPosts.items})
        return result.data.listPosts.items;
    }

    render() {
        let {posts} = this.state;
        return posts.map((post,i) => {
            return (
                <div key={i} className = 'posts' style ={rowStyle}>
                    <h1>{post.postTitle}</h1>
                    <span style = {{fontStyle:'italic',color:'#0ca5e297'}}>
                        Wrote By: {post.postOwnerUsername} on
                        <time style = {{fontStyle:'italic'}}>
                        {" "} {new Date(post.createdAt).toDateString()} 
                        </time>
                    </span>

                    <p>{post.postBody}</p>
                    <br/>
                    <span>
                        <DeletePost/> 
                        <EditPost/>
                    </span>
                </div>
            )
        })     
    }
}

const rowStyle = {
    background:'#f4f4f4',
    padding: '10px',
    border: '1px #ccc dotted',
    margin: '14px'
}
export default DisplayPosts;
