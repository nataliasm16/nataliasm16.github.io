
// Variables de entorno
var currentFilter = null;

// Generar thumbnails a partir de un filtro
var generateFilter = function generateFilter(e)
{
	stopPropagation(e);
	animateThumbnailsStop();
	var target = $(e.currentTarget);
	var filter = target.data('folder');

	// Detectar si se ha pulsado el mismo filtro = todos
	if (currentFilter === filter)
	{
		currentFilter = null;
		target.removeClass('selected');
	}
	else 
	{
		// Se ha pulsado previamente otro filtro
		if (currentFilter !== null)
		{
			var prev = $('[data-folder="' + currentFilter + '"]');
			prev.removeClass('selected');
		}

		// Asignar nuevo filtro igualmente
		target.addClass('selected');
		currentFilter = filter;
	}

	createThumbnails(numberPortfolio);
	animateThumbnailsStart();
};