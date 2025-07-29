
export const NotificationsPage = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold text-white">Notifications</h1>
                <button className="text-sm text-blue-400 hover:text-blue-300">Mark all as read</button>
            </div>

            <Card>
                <div className="divide-y divide-gray-700">
                    {notificationsData.map(notification => (
                        <div key={notification.id} className={`p-4 flex items-start space-x-4 ${notification.unread ? 'bg-gray-800/50' : ''}`}>
                            {notification.unread && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>}
                            <div className={`flex-shrink-0 ${notification.unread ? '' : 'ml-5'}`}>
                                {notification.type === 'comment' && <span className="text-xl">💬</span>}
                                {notification.type === 'follower' && <span className="text-xl">❤️</span>}
                                {notification.type === 'logistics' && <span className="text-xl">🚚</span>}
                                {notification.type === 'earnings' && <span className="text-xl">💰</span>}
                                {notification.type === 'mention' && <span className="text-xl">@</span>}
                            </div>
                            <div className="flex-grow">
                                <p className="text-white">{notification.text}</p>
                                <p className="text-sm text-gray-400 mt-1">{notification.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

