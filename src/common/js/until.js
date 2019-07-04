function getRom(min,max){
	return Math.floor(Math.random()*(max-min+1)+min)
}

export default function randomList(arr){
	let _arr = arr.slice();
	if(!_arr){
		return
	}
	for(let i=0;i<_arr.length;i++){
		let j = getRom(0,i)
		let t = _arr[i];
		 _arr[i] = _arr[j];
		 _arr[j] = t
	}
	return _arr
}

//节流
export function TimeoutQuery(fun,delay){
	let timer = null
	return function(...args){
		if(timer){
			clearTimeout(timer)
		}
		timer = setTimeout(()=>{
			fun.apply(this,args)
		},delay)
	}
}