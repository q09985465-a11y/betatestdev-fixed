export default function TableHeader({

    columns

}){

    return(

        <thead>

            <tr>

                {

                    columns.map(col=>(

                        <th key={col}>

                            {col}

                        </th>

                    ))

                }

            </tr>

        </thead>

    )

}