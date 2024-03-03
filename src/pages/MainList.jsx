import { memo, useCallback, useEffect, useState } from "react";
import { ItemTemplate } from "./_mainList/ItemTemplate";
import { MainListContext } from "./_mainList/MainListContext";
import { AddButton } from "./_mainList/AddButton";
import * as service from "../service";
import { useLoaderData } from "react-router-dom";
import classNames from "classnames";

const Search = memo(({ className, onSearch }) => {
    const [searchString, setSearchString] = useState('');
    const [searchType, setSearchType] = useState('categories');
    return (
        <div className="flex items-baseline">
            <input
                value={searchString}
                onChange={useCallback((e) => setSearchString(e.target.value), [])}
                className={classNames(
                    'w-52',
                    "truncate block drop-shadow-md mt-6 rounded-md",
                    "border-0 py-1.5 pl-2 pr-2 text-gray-900",
                    "ring-1 ring-inset ring-gray-300 placeholder:text-gray-400",
                    "focus:ring-2 focus:ring-inset focus:ring-indigo-600",
                    "sm:text-sm sm:leading-6",
                    'mr-2',
                    className
                )}
                placeholder="Поиск..."
            />
            <select
                className={classNames(
                    "block drop-shadow-md mt-6 rounded-md",
                    "border-0 py-1.5 pl-2 pr-2 text-gray-900",
                    "ring-1 ring-inset ring-gray-300 placeholder:text-gray-400",
                    "focus:ring-2 focus:ring-inset focus:ring-indigo-600",
                    "sm:text-sm sm:leading-6",
                    'mr-2'
                )}
                value={searchType}
                onChange={useCallback((e) => setSearchType(e.target.value), [])}
            >
                <option value="categories">категориям</option>
                <option value="title">названию</option>
                <option value="content">контенту</option>
            </select>
            <button
                className={classNames(
                    "border-0 ring-1 ring-inset ring-gray-300 rounded-md",
                    "py-1.5 pl-2 pr-2 hover:bg-gray-200",
                    'active:bg-gray-700',
                    'shadow-lg transition-colors ease-linear',
                    'active:shadow-2xl',
                    'mr-2'
                )}
                onClick={useCallback(() => onSearch(searchString, searchType), [searchString, searchType])}
            >
                Найти
            </button>
            <button
                className={classNames(
                    "border-0 ring-1 ring-inset ring-gray-300 rounded-md",
                    "py-1.5 pl-2 pr-2 hover:bg-gray-200",
                    'active:bg-gray-700',
                    'shadow-lg transition-colors ease-linear',
                    'active:shadow-2xl'
                )}
                onClick={useCallback(() => {
                    onSearch('', 'categories');
                    setSearchString('');
                    setSearchType('categories');
                }, [searchType])}
            >
                Сбросить
            </button>
        </div>
    );
})


const List = memo(({ items, onDeleteItem, onChangeItem, onAddItem, className }) => {
    if (items === undefined) {
        throw Error('Items for list is undefined');
    }
    return (
        <MainListContext.Provider value={{
            onDeleteItem,
            onChangeItem,
            onAddItem,
        }}>
            <div className={className}>
                {items.map((item) => (
                    <ItemTemplate
                        key={item._id}
                        id={item._id}
                        title={item.title}
                        categories={item.categories}
                        content={item.content}
                        status={item.status}
                    />
                ))}
                {!items.length && (
                    <>
                        <div className="text-center italic text-lg w-full mx-auto">Список пуст добавть новый пост!</div>
                    </>
                )}
            </div>
        </MainListContext.Provider>
    );
});

export const MainList = memo((props) => {
    const posts = useLoaderData();
    const [items, setItems] = useState(posts);

    const reloadList = useCallback(
        (search, type) => service.loadPosts({
            searchString: search,
            searchType: type
        }).then((posts) => setItems(posts)),
        []
    );
    
    return (
        <div className="border-8 rounded-xl border-gray-300 p-3">
            <Search
                onSearch={useCallback((searchString, searchType) => {
                    reloadList(searchString, searchType);
                }, [reloadList])}
                className="mb-4"
            />
            <div className="flex justify-between items-baseline mb-6">
                <div className="font-bold text-3xl">Список постов</div>
                <AddButton  />
            </div>
            <List
                items={items}
                onDeleteItem={useCallback((id) => {
                    service.deletePost(id).then(() => reloadList());
                }, [items])}
            />
        </div>
    );
});

MainList.displayName = 'MainList';

export const mainListLoader = async ({ request, params }) => await service.loadPosts();