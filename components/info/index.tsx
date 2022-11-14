import Image from 'next/image'
import style from './index.module.css'
import _avatar from './images/avatar.png'
import classNames from 'classnames'

interface InfoProps {
    avatar ?: any
    name  ?: string
    id ?: string
    className ?: string
}


function Info(props: InfoProps) {
    const classes = classNames(props.className,style.wrapper)
    return (
        <div className={classes}>
        <div style={{display:'flex',flexDirection:'row'}}>
        <div className={style.avatar}>
            <Image src={props.avatar ? props.avatar : _avatar} className={style.avatar}  alt=''></Image>
        </div>
        <div className={style.name}>
            {props.name ? props.name : 'Jerry'} 
        </div>
        <div className={style.id}>
            {props.id ? props.id : '11xx222'}
        </div>
        </div>
    </div>
    )
}
export default Info