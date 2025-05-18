
import { useParams } from 'react-router-dom';
import { FullBlog } from '../components/FullBlog';
import { useblog } from '../hooks'

export const Blog = () => {
    const{id} = useParams()
    const{loading,blog} = useblog({
        id:id||""
    });
    if(loading){
        return <div> Blog is loading</div>
    }
  return (
    <div>
        <FullBlog blog ={blog} />
    </div>
  )
}
