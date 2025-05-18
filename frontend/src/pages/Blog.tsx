
import { useParams } from 'react-router-dom';
import { FullBlog } from '../components/FullBlog';
import { useblog } from '../hooks'
import { Spinner } from '../components/Spinner';
import { AppBar } from '../components/AppBar';

export const Blog = () => {
    const{id} = useParams()
    const{loading,blog} = useblog({
        id:id||""
    });
    if(loading){
        return <div>
            <AppBar/> 
            <div className='h-screen flex flex-col justify-center'> 
                <div className='flex justify-center'>
                <Spinner/>
                </div>
            </div>
        </div>
    }
  return (
    <div>
        <FullBlog blog ={blog} />
    </div>
  )
}
