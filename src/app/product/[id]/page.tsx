import ProductAddToCart from '@/components/ProductAddToCart';
import Image from 'next/image';
import ProductSlider from '@/components/ui/ProductSlider';
import { getTranslations } from 'next-intl/server';
import type { Product } from '@/services/models/product';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL as string;

async function fetchProduct(id: string): Promise<Product | null> {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `{ product(id: "${id}") { id sku name price images colors sizes details featured sale discountPercent effectivePrice category } }`,
    }),
  });
  const json = await res.json();
  return json?.data?.product ?? null;
}

async function fetchAllProductIds(): Promise<string[]> {
  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: '{ products { id } }' }),
  });
  const json = await res.json();
  return (json?.data?.products ?? []).map((p: { id: string }) => p.id);
}

export default async function Product(props: any) {
  const params = (await props.params) as { id: string };
  const id = params.id;
  const product = await fetchProduct(id);
  const translate = await getTranslations('ProductPage');

  if (!product) {
    return <div>{translate('notFound')}</div>;
  }

  return (
    <div className="pt-12">
      <div className="py-12 flex flex-col-reverse items-center justify-center gap-20 md:flex-row">
        <div>
          {product.sale && (product.discountPercent ?? 0) > 0 && (
            <div className="rounded-lg mb-4 bg-wearit-red text-wearit-white w-[80px] p-1 text-center">
              {translate('sale')}
            </div>
          )}
          <div className="w-[350px] h-[350px] relative">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw"
              style={{ objectFit: 'cover' }}
              className="rounded"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <div className="bg-neutral-200 h-[75px] w-[75px] rounded"></div>
            <div className="bg-neutral-200 h-[75px] w-[75px] rounded"></div>
            <div className="bg-neutral-200 h-[75px] w-[75px] rounded"></div>
            <div className="bg-neutral-200 h-[75px] w-[75px] rounded"></div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <header>
            <h3>{product.name}</h3>
          </header>
          {product.sale && (product.discountPercent ?? 0) > 0 ? (
            <div className="flex gap-2">
              <p className="subtitle-1 text-neutral-500 line-through">
                ${product.price}
              </p>
              <p className="subtitle-1 text-wearit-red">
                ${(product.effectivePrice ?? product.price).toFixed(2)}
              </p>
            </div>
          ) : (
            <p className="subtitle-1 text-neutral-500">${product.price}</p>
          )}
          <ProductAddToCart product={product} />
          <p className="text-caption underline hover:cursor-pointer hover:text-wearit-red">
            {translate('sizeChart')}
          </p>
          <div>
            <p className="subtitle-1">{translate('details')}</p>
            <ul className="list-disc">
              {product.details.map((item) => (
                <li className="text-body-1 ml-4" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-[900px] mx-auto py-20 hidden md:block">
        <p className="text-center subtitle-1 pb-6">{translate('youMightLike')}</p>
        <ProductSlider currentId={id} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const ids = await fetchAllProductIds();
  return ids.map((id) => ({ id }));
}
