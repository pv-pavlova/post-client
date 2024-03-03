import { memo, useCallback, useContext, useMemo } from "react";
import { Link } from 'react-router-dom';
import classNames from "classnames";

import './_itemTemplate.css';
import {MainListContext} from "./MainListContext";

export const ItemTemplate = memo(({ categories, id, ...props}) => {
    const { onDeleteItem } = useContext(MainListContext);
    return (
        <div className={classNames(
            'mb-2',
            'flex',
            'justify-between',
            'rounded-lg',
            'border-2 border-gray-200',
            'p-2',
            'h-full',
            'shadow-lg transition-colors ease-linear'
        )}>
            <div>
                <Link
                    className="font-bold text-lg hover:text-gray-500 transition-colors ease-linear"
                    to={`post/${id}/true`}
                >{props.title}</Link>
                {categories.length > 0
                    ? (
                    <div className="font-light italic">
                        <span className="not-italic mr-1">Категории:</span>
                        {categories}
                    </div>
                    )
                    : (
                        <div className="font-light italic">
                            Без категорий
                        </div>
                    )
                }
                <div>{props.content}</div>
            </div>
            <div className="shrink-0">
                <button
                    className="text-white bg-red-400 hover:bg-red-100 active:bg-red-700 rounded p-1 px-3 mr-4 transition-colors ease-linear"
                    onClick={useCallback(() => {
                        onDeleteItem(id);
                    }, [onDeleteItem, id])}
                >Удалить</button>
                <Link
                    className="text-white bg-blue-400 hover:bg-blue-100 active:bg-blue-700 rounded p-1 px-3 transition-colors ease-linear"
                    to={`post/${id}/false`}
                >Редактировать</Link>
            </div>
        </div>
    );
});

ItemTemplate.displayName = 'MainList/ItemTemplate';