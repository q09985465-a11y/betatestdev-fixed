export default function SearchBar({

    value,
    onChange

}){

    return(

        <input

            className="search"

            placeholder="Buscar producto..."

            value={value}

            onChange={(e)=>onChange(e.target.value)}

        />

    )

}