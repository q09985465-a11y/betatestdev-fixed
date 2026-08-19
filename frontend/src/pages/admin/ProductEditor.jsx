import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import ProductForm from "../../components/admin/ProductForm";

import {
  getProducts,
  createProduct,
  updateProduct,
} from "../../services/productService";

import {
  getPendingUploads,
  extractImageNames
} from "../../components/admin/images/imageUtils";

import { uploadImages } from "../../services/uploadService";

import { getCategories } from "../../services/categoryService";

export default function ProductEditor() {

  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {

    async function load() {

      try {

        // 1. cargar categorías SIEMPRE
        const cats = await getCategories();
        setCategories(cats);

        // 2. si es creación nueva
        if (!id) {
          setLoading(false);
          return;
        }

        // 3. cargar productos para edición
        const products = await getProducts();

        const found = products.find(
          (p) => String(p.id) === String(id)
        );

        setProduct(found || null);

      } catch (err) {

        console.error("Error cargando editor:", err);

      } finally {

        setLoading(false);

      }

    }

    load();

  }, [id]);

  async function handleSave(data){

	  try {

		let images = data.images;

		const pending = getPendingUploads(images);


		if(pending.length){

		  const response = await uploadImages(
			pending.map(img=>img.file)
		  );


		  let index = 0;


		  images = images.map(img=>{

			if(img.file){

			  return {
				...img,
				filename:
				  response.files[index++].filename,
				uploaded:true,
				file:null,
				existing:true
			  };

			}

			return img;

		  });

		}


		const payload = {

		  ...data,

		  images: extractImageNames(images)

		};


		if(id){

		  await updateProduct(id,payload);

		}else{

		  await createProduct(payload);

		}


		navigate("/admin/products");


	  }catch(error){

		console.error(error);
		alert(error.message);

	  }

	}

  if (loading) {
    return <h2>Cargando...</h2>;
  }

  return (
    <div className="page">

      <h1>
        {id ? "Editar producto" : "Nuevo producto"}
      </h1>

      <ProductForm
        initialData={product}
        categories={categories}
        onSubmit={handleSave}
        onCancel={() => navigate("/admin/products")}
      />

    </div>
  );
}