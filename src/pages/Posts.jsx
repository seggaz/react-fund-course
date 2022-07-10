import React, { useEffect, useMemo, useRef, useState } from 'react';
import ClassCounter from './components/ClassCounter';
import Counter from './components/counter';
import Postitem from './components/Postitem';
import './styles/App.css';
import PostList from './components/Postlist';
import MyButton from './components/UI/button/MyButton';
import MyInput from './components/UI/input/MyInput';
import PostForm from "./components/PostForm";
import MySelect from './components/UI/select/MySelect';
import Postfilter from './components/Postfilter';
import MyModal from './components/UI/MyModal/MyModal';
import {usePosts} from './hooks/usePosts';
import axios from 'axios';
import PostService from './components/API/PostService';
import Loader from './components/UI/Loader/Loader';
import {useFething} from './hooks/useFething';
import {getPageCount} from './utils/page';
import {getPagesArray} from './utils/page';
import Pagination from './components/UI/pagination/Pagination';


function Posts() {
	const [posts, setPosts] = useState([])
	const [filter, setFilter] = useState({sort: '', query: ''})
	const [modal, setModal] = useState(false);
	const [totalPage, setTotalPage] = useState(0);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const sortAndSearchedPosts = usePosts(posts, filter.sort, filter.query);
	
	
	
	

	const [fethPosts, isPostsLoading, postError] = useFething( async (limit, page) => {
		const response = await PostService.getAll(limit, page);
		setPosts(response.data)
		const totalCount = response.headers['x-total-count']
		setTotalPage(getPageCount(totalCount, limit));
	})

	console.log(totalPage);
	

	useEffect(() => {
		fethPosts(limit, page)
	}, [])

	
	const createPost = (newPost) => {
		setPosts([...posts, newPost])
		setModal(false)
	}

	
	//Получаем post из дочернего компонента
	const removePost = (post) => {
		setPosts(posts.filter(p => p.id !== post.id))
	}

	const changePage = (page) => {
		setPage(page)
		fethPosts(limit, page)

	}
	
  return (
    <div className="App">
		<button onClick={fethPosts}>GET POSTS</button>
		<MyButton style={{marginTop:30}} onClick={() => setModal(true)}>
			Создать пользователя
		</MyButton>
		<MyModal visible={modal} setVisible={setModal}>
			<PostForm create={createPost}/>
		</MyModal>
		<hr style={{margin: '15px 0'}}/>
		<Postfilter 
			filter={filter} 
			setFilter={setFilter}
			/>
			{postError &&
				<h1>Произошла ошибка ${postError}</h1>
			}
			{isPostsLoading
				? <div style={{display: 'flex', justifyContent: 'center', marginTop: 50}} ><Loader/></div> 
				: <PostList remove={removePost} posts={sortAndSearchedPosts} title="Посты про Javascript"/>
			}
			<Pagination
				page={page}
				changePage={changePage} 
				totalPage={totalPage}
			/>
			
	</div>
  );
}

export default Posts;
