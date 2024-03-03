import { memo, useCallback, useState } from "react";
import { useNavigate, useLoaderData, useParams } from "react-router-dom";
import Picker from 'emoji-picker-react';
import * as service from "../service";

import classNames from "classnames";

const CategoriesBlock = memo(({ categories }) => {
    if (!categories.length) {
        return (
            <div className="italic text-2xl mb-2">
                Без категорий
            </div>
        )
    }
    return (
        <div className="italic text-2xl mb-2">
            <span className="not-italic mr-2">Категории:</span>
            {categories}
        </div>
    )
});

const Validator = memo(({ children, valid = true, inValidStatus, className }) => {
    return (
        <div className={className}>
            {!valid && (
                <div className="mb-1 text-red-500">
                    {inValidStatus}
                </div>
            )}
            <div className={classNames(
                !valid && 'border-2 rounded-md border-red-400'
            )}>
                {children}
            </div>
        </div>
    );
});

export const Post = memo(() => {
    const params = useParams();
    const readOnly = params.readOnly === 'true';
    const prefetchRecord = useLoaderData();
    const id = prefetchRecord?._id;
    const navigate = useNavigate();
    const [title, setTitle] = useState(prefetchRecord?.title || '');
    const [categories, setCategories] = useState(prefetchRecord?.categories || '');
    const [content, setContent] = useState(prefetchRecord?.content || '');
    const [titleValid, setTitleValid] = useState(true);
    const [contentValid, setContentValid] = useState(true);

    const goBack = useCallback(() => navigate(-1), []);

    const save = useCallback(() => {
        const titleIsValid = title.length > 0;
        const contentIsValid = content.length > 0;
        setTitleValid(titleIsValid);
        setContentValid(contentIsValid);
        if (!titleIsValid || !contentIsValid) {
            return;
        }
        let promise;
        if (!id) {
            promise = service.addPost({
                title,
                content,
                categories
            });
        } else {
            promise = service.updatePost({
                id,
                title,
                content,
                categories
            });
        }
        promise
            .then(() => goBack())
            .catch((error) => console.log(error));
    }, [title, content, categories, id, goBack]);

    const onEmojiClick = useCallback((emojiObject) => {
        setContent((prevContent) => prevContent + emojiObject.emoji);
    });
    
    const onTitleChange = useCallback((e) => setTitle(e.target.value), []);
    const onCategoriesChange = useCallback((e) => setCategories(e.target.value), []);
    const onContentChange = useCallback((e) => setContent(e.target.value), []);

    return (
        <div className="p-3 border-8 border-gray-200 flex-col mt-6 rounded-xl shadow-lg">
            <div className="flex items-baseline justify-between">
                <button
                    className="text-lg text-white bg-blue-500 hover:bg-blue-400 active:bg-blue-700 rounded-lg p-3 mb-8"
                    onClick={goBack}
                >
                    Вернуться к списку постов
                </button>
                {!readOnly && (
                    <button
                        className={classNames("p-3 text-lg drop-shadow-md",
                            "font-bold",
                            "bg-green-400 hover:bg-green-100 active:bg-green-600",
                            "rounded-lg",
                            "ease-linear transition-all")}
                        type="submit"
                        onClick={save}
                    >Сохранить</button>
                )}
            </div>
            {!readOnly
                ? (
                    <Validator
                        className="mt-6"
                        valid={titleValid}
                        inValidStatus="Введите какое-нибудь название"
                    >
                        <input
                            type="text"
                            name="title"
                            className={classNames(
                                "block drop-shadow-md w-full rounded-md",
                                "border-0 py-1.5 pl-7 pr-20 text-gray-900",
                                "ring-1 ring-inset ring-gray-300 placeholder:text-gray-400",
                                "focus:ring-2 focus:ring-inset focus:ring-indigo-600",
                                "sm:text-sm sm:leading-6")}
                            placeholder="Название поста"
                            value={title}
                            onChange={onTitleChange}
                        />
                    </Validator>
                )
                : (
                    <div className="font-bold text-3xl mb-2">{title}</div>
                )
            }
            {!readOnly
                ? (
                    <input
                        type="text"
                        name="categories"
                        className={classNames(
                            "block mt-6 drop-shadow-md w-full rounded-md",
                            "border-0 py-1.5 pl-7 pr-20 text-gray-900",
                            "ring-1 ring-inset ring-gray-300 placeholder:text-gray-400",
                            "focus:ring-2 focus:ring-inset focus:ring-indigo-600",
                            "sm:text-sm sm:leading-6")}
                        placeholder="Категории"
                        value={categories}
                        onChange={onCategoriesChange}
                    />
                )
                : (
                   <CategoriesBlock categories={categories}/>
                )
            }
            {!readOnly
                ? (
                    <Validator
                        className="mt-6"
                        valid={contentValid}
                        inValidStatus="Введите какой-нибудь текст"
                    >
                        <textarea
                            name="content"
                            className={classNames(
                                "block drop-shadow-md w-full rounded-md",
                                "border-0 py-1.5 pl-7 pr-20 text-gray-900",
                                "ring-1 ring-inset ring-gray-300 placeholder:text-gray-400",
                                "focus:ring-2 focus:ring-inset focus:ring-indigo-600",
                                "sm:text-sm sm:leading-6")}
                            placeholder="Введите текст..."
                            value={content}
                            onChange={onContentChange}
                        />
                    </Validator>
                )
                : (
                    <div className="text-2xl mb-2">
                        {content}
                    </div>
                )
            }
            {!readOnly && (<Picker className="mt-6" pickerStyle={{ width: "100%" }} onEmojiClick={onEmojiClick} />)}
        </div>
    );
});

Post.displayName = 'Post';

export const postLoader = async ({ request, params }) => {
    return await service.readPost(params.id);
}