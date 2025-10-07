import React from 'react';
import TVSeriesRow from '../components/tv/TVSeriesRow';
import { 
  usePopularTVSeries, 
  useTopRatedTVSeries, 
  useTrendingTVSeries,
  useOnTheAirTVSeries,
  useAiringTodayTVSeries 
} from '../hooks/useMovies';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorDisplay from '../components/ui/ErrorDisplay';

const TVSeriesPage: React.FC = () => {
  const { data: popularSeries, isLoading: popularLoading, error: popularError } = usePopularTVSeries();
  const { data: topRatedSeries, isLoading: topRatedLoading, error: topRatedError } = useTopRatedTVSeries();
  const { data: trendingSeries, isLoading: trendingLoading, error: trendingError } = useTrendingTVSeries();
  const { data: onTheAirSeries, isLoading: onTheAirLoading, error: onTheAirError } = useOnTheAirTVSeries();
  const { data: airingTodaySeries, isLoading: airingTodayLoading, error: airingTodayError } = useAiringTodayTVSeries();

  const isLoading = popularLoading || topRatedLoading || trendingLoading || onTheAirLoading || airingTodayLoading;
  const hasError = popularError || topRatedError || trendingError || onTheAirError || airingTodayError;

  if (isLoading && !popularSeries && !topRatedSeries && !trendingSeries) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (hasError && !popularSeries && !topRatedSeries && !trendingSeries) {
    return (
      <div className="min-h-screen bg-black pt-24 flex items-center justify-center">
        <ErrorDisplay message="Error al cargar las series" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black text-white mb-6 animate-fade-in">
            📺 Series de TV
          </h1>
          <p className="text-gray-300 text-xl animate-fade-in" style={{animationDelay: '0.1s'}}>
            Las mejores series para maratonear
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 rounded animate-fade-in" style={{animationDelay: '0.2s'}}></div>
        </div>
        
        <div className="space-y-12">
          {trendingSeries && (
            <div className="animate-slide-in-right" style={{animationDelay: '0.3s'}}>
              <TVSeriesRow
                title="🔥 Trending Ahora"
                series={trendingSeries.results}
                isLoading={trendingLoading}
                error={trendingError}
              />
            </div>
          )}

          {popularSeries && (
            <div className="animate-slide-in-right" style={{animationDelay: '0.4s'}}>
              <TVSeriesRow
                title="🌟 Más Populares"
                series={popularSeries.results}
                isLoading={popularLoading}
                error={popularError}
              />
            </div>
          )}

          {topRatedSeries && (
            <div className="animate-slide-in-right" style={{animationDelay: '0.5s'}}>
              <TVSeriesRow
                title="🏆 Mejor Valoradas"
                series={topRatedSeries.results}
                isLoading={topRatedLoading}
                error={topRatedError}
              />
            </div>
          )}

          {onTheAirSeries && (
            <div className="animate-slide-in-right" style={{animationDelay: '0.6s'}}>
              <TVSeriesRow
                title="📡 Al Aire Ahora"
                series={onTheAirSeries.results}
                isLoading={onTheAirLoading}
                error={onTheAirError}
              />
            </div>
          )}

          {airingTodaySeries && (
            <div className="animate-slide-in-right" style={{animationDelay: '0.7s'}}>
              <TVSeriesRow
                title="🎭 Transmitiendo Hoy"
                series={airingTodaySeries.results}
                isLoading={airingTodayLoading}
                error={airingTodayError}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TVSeriesPage;