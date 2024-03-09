import padri from './perang_padri.jpg';


const Detail = () => {return (
<div class="flex flex-col bg-orange-200 h-screen">
    <div class ="justify-items-center">
        <p class='text-2xl font-serif'>Perang Padri</p>
    </div>
    <div>
        <img src={padri}></img>
    </div>
</div>

)
}

export default Detail;