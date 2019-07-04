import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX = 20
const PLAY_KEY = '__PLAY__'
const PLAY_MAX_LENGTH = 200
const LIKE_KEY = '__LIKE__'
const LIKE_MAX_LENGTH = 200
function save(arr,val,compare,max){
    let index = arr.findIndex(compare)
    if(index == 0){
        return
    }
    if(index>0){
        arr.splice(index,1)
    }
    arr.unshift(val)
    if(max && arr.length>max){
        arr.pop()
    }
}

function deleteH(arr,val,compare){
    let index = arr.findIndex(compare)
    if(index>=0){
        arr.splice(index,1)
    }
}
export function saveHistory(query){
    let searchs = storage.get(SEARCH_KEY,[])
     save(searchs,query,(item)=>{
       return item === query
    },SEARCH_MAX)
    storage.set(SEARCH_KEY,searchs)
    return searchs
}

export function deleteOne(query){
    let searchs = storage.get(SEARCH_KEY,[])
    deleteH(searchs,query,(item)=>{
        return item === query
    })
    storage.set(SEARCH_KEY,searchs)
    return searchs
}

export function deleteHistory(){
    storage.remove(SEARCH_KEY)
    return []
}

export function inSerplayHistory(song){
    let arr = storage.get(PLAY_KEY,[])
    save(arr,song,(item)=>{
        return item.id === song.id
    },PLAY_MAX_LENGTH)
    storage.set(PLAY_KEY,arr)
    return arr
}
export function loadSearch(){
    return storage.get(SEARCH_KEY,[])
}
export function loadPlay(){
    return storage.get(PLAY_KEY,[])
}

export function inserLike(song){
    let like = storage.get(LIKE_KEY,[])
    save(like,song,item=>{
        return item.id === song.id
    },LIKE_MAX_LENGTH)
    storage.set(LIKE_KEY,like)
    return like
}
export function deleteLike(song){
    let like = storage.get(LIKE_KEY,[])
    deleteH(like,song,item=>{
       return item.id === song.id
    })
    storage.set(LIKE_KEY,like)
    return like
}
export function loadLike(){
    return storage.get(LIKE_KEY,[])
}