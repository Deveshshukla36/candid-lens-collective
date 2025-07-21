import { useState } from 'react';
import { usePhotos } from '@/context/PhotoContext';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Heart, MessageCircle, Share, MoreHorizontal, Image, Link2, Gift, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GlobalPost {
  id: string;
  type: 'image' | 'link' | 'text';
  content: string;
  caption: string;
  author: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  comments: number;
}

const Global = () => {
  const { currentUser } = useUser();
  const [posts, setPosts] = useState<GlobalPost[]>([
    {
      id: '1',
      type: 'image',
      content: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=600&fit=crop',
      caption: 'Simple as that 😊',
      author: 'the.successpreneur',
      timestamp: '14h',
      likes: 24,
      isLiked: false,
      comments: 2
    }
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState({
    type: 'text' as 'image' | 'link' | 'text',
    content: '',
    caption: ''
  });

  const handleCreatePost = () => {
    if (!currentUser || !newPost.caption.trim()) return;

    const post: GlobalPost = {
      id: Date.now().toString(),
      type: newPost.type,
      content: newPost.content,
      caption: newPost.caption,
      author: currentUser.username,
      timestamp: 'now',
      likes: 0,
      isLiked: false,
      comments: 0
    };

    // Admin posts go first
    if (currentUser.isAdmin || currentUser.username === 'Devesh') {
      setPosts(prev => [post, ...prev]);
    } else {
      setPosts(prev => [...prev, post]);
    }

    setNewPost({ type: 'text', content: '', caption: '' });
    setIsCreating(false);
  };

  const toggleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const sortedPosts = [...posts].sort((a, b) => {
    // Admin posts always first
    const aIsAdmin = a.author === 'Devesh';
    const bIsAdmin = b.author === 'Devesh';
    
    if (aIsAdmin && !bIsAdmin) return -1;
    if (!aIsAdmin && bIsAdmin) return 1;
    
    // Then by timestamp (newest first)
    return new Date(b.timestamp === 'now' ? Date.now() : b.timestamp).getTime() - 
           new Date(a.timestamp === 'now' ? Date.now() : a.timestamp).getTime();
  });

  const renderPostContent = (post: GlobalPost) => {
    switch (post.type) {
      case 'image':
        return (
          <div className="rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={post.content} 
              alt="Post content"
              className="w-full h-auto object-cover"
            />
          </div>
        );
      case 'link':
        return (
          <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
            <Link2 className="w-4 h-4 text-gray-500 mb-1" />
            <a 
              href={post.content} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              {post.content}
            </a>
          </div>
        );
      default:
        return null;
    }
  };

  const isAdmin = (username: string) => username === 'Devesh';

  return (
    <div className="min-h-screen bg-white/95 backdrop-blur-sm">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">Global</h1>
            </div>
            <Button 
              onClick={() => setIsCreating(true)}
              size="sm"
              className="bg-black hover:bg-gray-800 text-white"
            >
              Create Post
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Create Post Modal */}
        {isCreating && (
          <Card className="mb-6 border shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex space-x-2 border-b pb-3">
                  <Button
                    variant={newPost.type === 'text' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewPost(prev => ({ ...prev, type: 'text' }))}
                  >
                    Text
                  </Button>
                  <Button
                    variant={newPost.type === 'image' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewPost(prev => ({ ...prev, type: 'image' }))}
                  >
                    <Image className="w-4 h-4 mr-1" />
                    Image
                  </Button>
                  <Button
                    variant={newPost.type === 'link' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setNewPost(prev => ({ ...prev, type: 'link' }))}
                  >
                    <Link2 className="w-4 h-4 mr-1" />
                    Link
                  </Button>
                </div>

                {newPost.type === 'image' && (
                  <Input
                    placeholder="Image URL"
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  />
                )}

                {newPost.type === 'link' && (
                  <Input
                    placeholder="https://example.com"
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  />
                )}

                <Textarea
                  placeholder="What's happening?"
                  value={newPost.caption}
                  onChange={(e) => setNewPost(prev => ({ ...prev, caption: e.target.value }))}
                  className="resize-none"
                  rows={3}
                />

                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreating(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreatePost}
                    disabled={!newPost.caption.trim()}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    Post
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts Feed */}
        <div className="space-y-6">
          {sortedPosts.map(post => (
            <Card key={post.id} className="border shadow-sm">
              <CardContent className="p-0">
                {/* Post Header */}
                <div className="p-4 pb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8 bg-gray-200" />
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">@{post.author}</span>
                      {isAdmin(post.author) && (
                        <CheckCircle className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-gray-500 text-sm">{post.timestamp}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Post Caption */}
                <div className="px-4 pb-3">
                  <p className="text-gray-900">{post.caption}</p>
                </div>

                {/* Post Content */}
                {post.content && (
                  <div className="px-4 pb-3">
                    {renderPostContent(post)}
                  </div>
                )}

                {/* Post Actions */}
                <div className="px-4 py-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <button 
                        onClick={() => toggleLike(post.id)}
                        className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition-colors"
                      >
                        <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        <span className="text-sm">{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-500 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-green-500 transition-colors">
                        <Share className="w-5 h-5" />
                        <span className="text-sm">1</span>
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Global;