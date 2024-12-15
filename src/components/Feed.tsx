import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Clock, Users, Calendar, Share2, Heart, 
  MessageCircle, Copy, Bookmark, Play, Plus, Run,
  Trophy, CircleDot, Dumbbell, Target
} from 'lucide-react';

// Types
interface Participant {
  id: number;
  name: string;
  avatar: string;
}

interface Activity {
  id: number;
  title: string;
  time: string;
  location: string;
  image: string;
  participants: Participant[];
}

interface Event {
  id: number;
  type: string;
  title: string;
  description: string;
  coverImage: string;
  teamCount: number;
  playerCount: number;
  prizePool: string;
}

interface Routine {
  id: number;
  title: string;
  schedule: string;
  image: string;
  participants: number;
}

interface Hub {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  icon: React.ReactNode;
}

interface Post {
  id: number;
  author: {
    name: string;
    avatar: string;
  };
  timeAgo: string;
  content: string;
  callToAction?: string;
}

interface FeedData {
  activities: Activity[];
  events: Event[];
  routines: Routine[];
  recommendedHubs: Hub[];
  communityPosts: Post[];
}

// Card Actions Component
const CardActions: React.FC<{ className?: string }> = ({ className = "border-t border-gray-700" }) => (
  <div className={`flex items-center justify-between p-3 ${className}`}>
    <div className="flex items-center gap-4">
      <button className="text-gray-400 hover:text-white transition-colors">
        <MessageCircle className="w-5 h-5" />
      </button>
      <button className="text-gray-400 hover:text-white transition-colors">
        <Heart className="w-5 h-5" />
      </button>
      <button className="text-gray-400 hover:text-white transition-colors">
        <Share2 className="w-5 h-5" />
      </button>
    </div>
    <div className="flex items-center gap-4">
      <button className="text-gray-400 hover:text-white transition-colors">
        <Copy className="w-5 h-5" />
      </button>
      <button className="text-gray-400 hover:text-white transition-colors">
        <Bookmark className="w-5 h-5" />
      </button>
    </div>
  </div>
);

// Activity Card Component
export const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 hover:border-[#573cff]/50 transition-all"
  >
    <div className="flex h-32">
      <div className="w-32 flex-shrink-0">
        <img 
          src={activity.image} 
          alt={activity.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 p-4">
        <h3 className="font-semibold mb-2">{activity.title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Clock className="w-4 h-4" />
          <span>{activity.time}</span>
          <MapPin className="w-4 h-4 ml-2" />
          <span>{activity.location}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {activity.participants.slice(0, 3).map((participant, i) => (
              <img 
                key={i}
                src={participant.avatar}
                alt={participant.name}
                className="w-6 h-6 rounded-full border-2 border-gray-800"
              />
            ))}
            {activity.participants.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                +{activity.participants.length - 3}
              </div>
            )}
          </div>
          <button className="btn-primary py-1 px-4 text-sm">Join</button>
        </div>
      </div>
    </div>
    <CardActions />
  </motion.div>
);

// Event Card Component
export const EventCard: React.FC<{ event: Event }> = ({ event }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 hover:border-[#573cff]/50 transition-all"
  >
    <div className="relative h-48">
      <img 
        src={event.coverImage} 
        alt={event.title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-0 p-4">
        <div className="flex items-center gap-2 text-sm mb-2">
          <Trophy className="w-4 h-4 text-[#573cff]" />
          <span className="text-[#573cff] font-semibold">{event.type}</span>
        </div>
        <h3 className="text-xl font-bold mb-1">{event.title}</h3>
        <p className="text-gray-300 text-sm">{event.description}</p>
      </div>
    </div>
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          <div>
            <div className="text-sm text-gray-400">Teams</div>
            <div className="font-semibold">{event.teamCount}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Players</div>
            <div className="font-semibold">{event.playerCount}</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">Prize Pool</div>
            <div className="font-semibold">{event.prizePool}</div>
          </div>
        </div>
        <button className="btn-primary py-2 px-6">View Details</button>
      </div>
    </div>
    <CardActions />
  </motion.div>
);

// Routine Tile Component
export const RoutineTile: React.FC<{ routine: Routine }> = ({ routine }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="aspect-square bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 hover:border-[#573cff]/50 transition-all relative group"
  >
    <img 
      src={routine.image} 
      alt={routine.title}
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
    <div className="absolute inset-0 p-4 flex flex-col justify-between">
      <h3 className="font-bold text-lg">{routine.title}</h3>
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
          <Calendar className="w-4 h-4" />
          <span>{routine.schedule}</span>
        </div>
        <button className="btn-primary py-2 w-full opacity-0 group-hover:opacity-100 transition-opacity">
          Join Next Session
        </button>
      </div>
    </div>
    <CardActions className="absolute bottom-0 left-0 right-0 bg-black/50" />
  </motion.div>
);

// Hub Carousel Component
export const HubCarousel: React.FC<{ hubs: Hub[] }> = ({ hubs }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-4">Recommended Hubs</h3>
    <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
      {hubs.map(hub => (
        <motion.div
          key={hub.id}
          whileHover={{ scale: 1.02 }}
          className="flex-shrink-0 w-64 bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-[#573cff]/50 transition-all"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-[#573cff]/10 flex items-center justify-center">
              {hub.icon}
            </div>
            <div>
              <h4 className="font-semibold">{hub.name}</h4>
              <p className="text-sm text-gray-400">{hub.memberCount} members</p>
            </div>
          </div>
          <p className="text-sm text-gray-300 mb-4">{hub.description}</p>
          <button className="btn-primary w-full py-2">Join Hub</button>
        </motion.div>
      ))}
    </div>
  </div>
);

// Community Post Card Component
export const CommunityPostCard: React.FC<{ post: Post }> = ({ post }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-[#573cff]/50 transition-all"
  >
    <div className="flex items-start gap-4">
      <img 
        src={post.author.avatar}
        alt={post.author.name}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold">{post.author.name}</span>
          <span className="text-gray-400">·</span>
          <span className="text-gray-400 text-sm">{post.timeAgo}</span>
        </div>
        <p className="text-gray-300 mb-3">{post.content}</p>
        {post.callToAction && (
          <button className="btn-primary py-1 px-4 text-sm">
            {post.callToAction}
          </button>
        )}
      </div>
    </div>
    <CardActions />
  </motion.div>
);

// Feed Tabs Component
const FeedTabs: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
}> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'for-you', label: 'For You' },
    { id: 'following', label: 'Following' },
    { id: 'in-your-city', label: 'In Your City' }
  ];

  return (
    <div className="border-b border-gray-800 mb-8">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-6 py-4 relative text-center ${
              activeTab === tab.id ? 'text-white' : 'text-gray-400'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#573cff]"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// Main Feed Component
const Feed: React.FC = () => {
  const [activeTab, setActiveTab] = useState('for-you');

  // Rich mock data
  const feedData: Record<string, FeedData> = {
    'for-you': {
      activities: [
        {
          id: 1,
          title: "5v5 Soccer Match",
          time: "Today, 6:00 PM",
          location: "Central Park Field 3",
          image: "/api/placeholder/400/300",
          participants: [
            { id: 1, name: "John Doe", avatar: "/api/placeholder/100/100" },
            { id: 2, name: "Jane Smith", avatar: "/api/placeholder/100/100" },
            { id: 3, name: "Mike Johnson", avatar: "/api/placeholder/100/100" },
            { id: 4, name: "Sarah Wilson", avatar: "/api/placeholder/100/100" },
          ]
        },
        {
          id: 2,
          title: "Basketball Training Session",
          time: "Tomorrow, 5:30 PM",
          location: "Downtown Sports Center",
          image: "/api/placeholder/400/300",
          participants: [
            { id: 1, name: "Alex Brown", avatar: "/api/placeholder/100/100" },
            { id: 2, name: "Chris Lee", avatar: "/api/placeholder/100/100" },
            { id: 5, name: "Emma Davis", avatar: "/api/placeholder/100/100" },
          ]
        }
      ],
      events: [
        {
          id: 1,
          type: "Tournament",
          title: "Summer Soccer League 2024",
          description: "Join the biggest amateur soccer league in the city",
          coverImage: "/api/placeholder/800/400",
          teamCount: 16,
          playerCount: 176,
          prizePool: "$2,000"
        }
      ],
      routines: [
        {
          id: 1,
          title: "Morning Run Club",
          schedule: "Every Sunday, 7:00 AM",
          image: "/api/placeholder/400/400",
          participants: 28
        },
        {
          id: 2,
          title: "Weekly Tennis Practice",
          schedule: "Every Wednesday, 6:00 PM",
          image: "/api/placeholder/400/400",
          participants: 12
        }
      ],
      recommendedHubs: [
        {
          id: 1,
          name: "City Soccer League",
          description: "The biggest soccer community in town",
          memberCount: 1240,
          icon: <CircleDot className="w-6 h-6 text-[#573cff]" />
          },
        {
          id: 2,
          name: "Tennis Club",
          description: "Find partners and join tournaments",
          memberCount: 856,
          icon: <Target className="w-6 h-6 text-[#573cff]" />
        },
        {
          id: 3,
          name: "Basketball Network",
          description: "Pickup games and training sessions",
          memberCount: 1102,
          icon: <Dumbbell className="w-6 h-6 text-[#573cff]" />
        }
      ],
      communityPosts: [
        {
          id: 1,
          author: {
            name: "David Chen",
            avatar: "/api/placeholder/100/100"
          },
          timeAgo: "2 hours ago",
          content: "Looking for 2 players to join our 5-a-side soccer team this Thursday. Intermediate level, friendly atmosphere!",
          callToAction: "Join Team"
        },
        {
          id: 2,
          author: {
            name: "Sarah Williams",
            avatar: "/api/placeholder/100/100"
          },
          timeAgo: "4 hours ago",
          content: "Just created a new tennis ladder tournament! Starting next week, all skill levels welcome. Register now to secure your spot!",
          callToAction: "Register"
        }
      ]
    },
    'following': {
      activities: [],
      events: [],
      routines: [],
      recommendedHubs: [],
      communityPosts: []
    },
    'in-your-city': {
      activities: [],
      events: [],
      routines: [],
      recommendedHubs: [],
      communityPosts: []
    }
  };

  const currentFeed = feedData[activeTab];

  return (
    <div className="max-w-4xl mx-auto">
      <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="space-y-8">
        {/* Featured Event */}
        {currentFeed.events?.length > 0 && (
          <EventCard event={currentFeed.events[0]} />
        )}

        {/* Activities Section */}
        <div className="space-y-4">
          {currentFeed.activities?.map(activity => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>

        {/* Hub Recommendations */}
        {currentFeed.recommendedHubs?.length > 0 && (
          <HubCarousel hubs={currentFeed.recommendedHubs} />
        )}

        {/* Community Posts */}
        <div className="space-y-4">
          {currentFeed.communityPosts?.map(post => (
            <CommunityPostCard key={post.id} post={post} />
          ))}
        </div>

        {/* Routines Grid */}
        {currentFeed.routines?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Your Routines</h3>
            <div className="grid grid-cols-2 gap-4">
              {currentFeed.routines.map(routine => (
                <RoutineTile key={routine.id} routine={routine} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;