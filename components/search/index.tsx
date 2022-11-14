import { useRef } from 'react'
import style from './index.module.css'
import Image from "next/image";
import _Search from './images/search.png'
import classNames from 'classnames'
interface SearchProps {
    placeHolder ?: string,
    onSearch : Function,
    defaultContent ?: string,
    className ?: string,
}

const DEFAULT_CONTENT = ''
const DEFAULT_PLACEHOLDER = 'Find the schedule you want to join here!'

function Search(props:SearchProps) {
    const inputRef = useRef<HTMLInputElement>()

    const classes = classNames(style.wrapper,props?.className)

    return (<div className={classes}>
        <input 
         type="text"
         className={style.input} 
         ref={inputRef}
         placeholder = {props.placeHolder ? props.placeHolder : DEFAULT_PLACEHOLDER}
         defaultValue={props.defaultContent ? props.defaultContent : DEFAULT_CONTENT}/>
          <div className={style.search} onClick={()=>props.onSearch(inputRef)}>
            <Image className={style.search}  src={_Search} alt="search"></Image>
        </div>
    </div>)
}

export default Search