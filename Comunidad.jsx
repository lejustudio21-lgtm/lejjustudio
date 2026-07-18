import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { IMAGES } from '@/lib/images';
import AppShell from '@/components/AppShell';
import { useLang } from '@/lib/LanguageContext';
import { Users, Send, MessageCircle, Pin, Heart, Archive } from 'lucide-react';

export default function Comunidad() {
  const { t } = useLang();
  const [tab, setTab] = useState('foro');
  const [topics, setTopics] = useState([]);
  const [activeTopic, setActiveTopic] = useState(null);
  const [posts, setPosts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postText, setPostText] = useState('');
  const [chatText, setChatText] = useState('');
  const [user, setUser] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);
        const tps = await base44.entities.WeeklyTopic.list('-created_date', 50);
        setTopics(tps || []);
        if (tps && tps.length > 0) {
          setActiveTopic(tps[0]);
          const ps = await base44.entities.ForumPost.filter({ topic_id: tps[0].id }, '-created_date', 50);
          setPosts(ps || []);
        }
        const msgs = await base44.entities.ChatMessage.list('-created_date', 50);
        setMessages(msgs || []);
      } catch {}
      setLoading(false);
    };
    load();

    const unsubPosts = base44.entities.ChatMessage.subscribe((event) => {
      if (event.type === 'create') {
        setMessages((m) => [...m, event.data]);
      }
    });
    return () => unsubPosts();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectTopic = async (topic) => {
    setActiveTopic(topic);
    try {
      const ps = await base44.entities.ForumPost.filter({ topic_id: topic.id }, '-created_date', 50);
      setPosts(ps || []);
    } catch {}
  };

  const submitPost = async () => {
    if (!postText.trim() || !activeTopic || !user) return;
    try {
      const post = await base44.entities.ForumPost.create({
        topic_id: activeTopic.id,
        author_name: user.full_name || user.email,
        author_id: user.id,
        content: postText.trim(),
        post_type: 'reflexion',
        reactions: 0,
        is_pinned: false,
      });
      setPosts((p) => [post, ...p]);
      setPostText('');
    } catch {}
  };

  const reactPost = async (post) => {
    try {
      const updated = await base44.entities.ForumPost.update(post.id, { reactions: (post.reactions || 0) + 1 });
      setPosts((ps) => ps.map((p) => (p.id === post.id ? updated : p)));
    } catch {}
  };

  const sendChat = async () => {
    if (!chatText.trim() || !user) return;
    try {
      const msg = await base44.entities.ChatMessage.create({
        author_name: user.full_name || user.email,
        author_id: user.id,
        content: chatText.trim(),
      });
      setMessages((m) => [...m, msg]);
      setChatText('');
    } catch {}
  };

  return (
    <AppShell>
      <div className="min-h-screen">
        <div className="relative h-56 overflow-hidden">
          <img src={IMAGES.diamondCentered} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-carbon" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
            <Users size={28} strokeWidth={1} className="text-gold mb-3" />
            <h1 className="text-3xl sm:text-4xl font-heading font-light tracking-wide text-gold text-glow-gold">{t('nav.comunidad')}</h1>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            <button onClick={() => setTab('foro')} className={`px-4 py-2 rounded-full text-xs font-heading tracking-wider transition-all ${tab === 'foro' ? 'bg-white/5 text-gold border border-white/20' : 'text-muted-silver border border-carbon hover:text-silver'}`}>Foro Semanal</button>
            <button onClick={() => setTab('chat')} className={`px-4 py-2 rounded-full text-xs font-heading tracking-wider transition-all ${tab === 'chat' ? 'bg-white/5 text-gold border border-white/20' : 'text-muted-silver border border-carbon hover:text-silver'}`}>Chat Comunitario</button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-white/10 border-t-gold rounded-full animate-spin" /></div>
          ) : tab === 'foro' ? (
            <div className="grid md:grid-cols-3 gap-6">
              {/* Topics sidebar */}
              <div className="md:col-span-1 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-silver font-heading tracking-widest uppercase mb-3">
                  <Archive size={14} strokeWidth={1.5} /> Temas
                </div>
                {topics.map((tp) => (
                  <button
                    key={tp.id}
                    onClick={() => selectTopic(tp)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${activeTopic?.id === tp.id ? 'bg-white/5 border-white/20' : 'border-carbon hover:border-white/10'}`}
                  >
                    <p className="text-xs font-heading text-silver line-clamp-2">{tp.title}</p>
                    {tp.week_date && <p className="text-[0.6rem] text-muted-silver mt-1">{tp.week_date}</p>}
                  </button>
                ))}
              </div>

              {/* Posts */}
              <div className="md:col-span-2">
                {activeTopic && (
                  <div className="glass-card rounded-2xl p-5 mb-4">
                    <h2 className="text-base font-heading font-medium text-gold mb-2">{activeTopic.title}</h2>
                    <p className="text-sm text-silver/60 font-body leading-relaxed">{activeTopic.context}</p>
                  </div>
                )}

                {/* New post */}
                <div className="glass-card rounded-xl p-3 mb-4 flex gap-2">
                  <textarea
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    placeholder="Comparte tu reflexión..."
                    rows={2}
                    className="flex-1 bg-transparent text-sm text-silver placeholder:text-muted-silver focus:outline-none resize-none"
                  />
                  <button onClick={submitPost} className="self-end w-8 h-8 rounded-lg bg-white/5 border border-carbon flex items-center justify-center text-gold hover:bg-white/10 transition-colors">
                    <Send size={14} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Posts list */}
                <div className="space-y-3">
                  {posts.map((post, i) => (
                    <div key={post.id || i} className="glass-card rounded-xl p-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                      {post.is_pinned && <Pin size={12} className="text-gold inline mr-1" />}
                      <p className="text-xs text-muted-silver mb-1">{post.author_name}</p>
                      <p className="text-sm text-silver/80 leading-relaxed font-body">{post.content}</p>
                      <button onClick={() => reactPost(post)} className="mt-2 flex items-center gap-1 text-xs text-muted-silver hover:text-gold transition-colors">
                        <Heart size={12} strokeWidth={1.5} /> {post.reactions || 0}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Chat */
            <div className="glass-card rounded-2xl flex flex-col h-[60vh]">
              <div className="flex items-center gap-2 p-4 border-b border-carbon">
                <MessageCircle size={16} strokeWidth={1.5} className="text-gold" />
                <p className="text-sm font-heading text-silver">Chat Comunitario</p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg, i) => (
                  <div key={msg.id || i} className={`flex ${msg.author_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${msg.author_id === user?.id ? 'bg-white/5 text-silver rounded-br-sm' : 'bg-white/[0.03] border border-carbon text-silver/80 rounded-bl-sm'}`}>
                      {msg.author_id !== user?.id && <p className="text-[0.65rem] text-muted-silver mb-0.5">{msg.author_name}</p>}
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="p-3 border-t border-carbon flex gap-2">
                <input
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-black/30 border border-carbon rounded-lg px-3 py-2 text-sm text-silver placeholder:text-muted-silver focus:outline-none focus:border-white/20"
                />
                <button onClick={sendChat} className="w-9 h-9 rounded-lg bg-white/5 border border-carbon flex items-center justify-center text-gold hover:bg-white/10 transition-colors">
                  <Send size={14} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}