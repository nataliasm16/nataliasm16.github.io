
// Variables de entorno
var timer = null;

// Animar thumbnails si fuera necesario 
var animateThumbnails = function animateThumbnails()
{
  	var elTemp = null;

  	// Recorrer thumbnails con propiedad animate
	$('.thumbnail.animate').each(function()
	{
		var th = $(this);

		// Buscar posicion mostrada / escondida
		var positions = this.children.length - 2;
		var positionOut = th.data('animate');
		var positionIn = (positionOut < positions) ? positionOut + 1 : 0;

		// Animar posiciones
		$(this.children[positionOut]).fadeOut("slow");
		$(this.children[positionIn]).fadeIn("slow");

		// Guardar nueva posicion
		th.data('animate', positionIn);
	});
  	timer = setTimeout(animateThumbnails, 8000);
};

// Crear timer para animateThumbnails
var animateThumbnailsStart = function animateThumbnailsStart()
{
	timer = setTimeout(animateThumbnails, 8000);
};

// Destruir timer para animateThumbnails
var animateThumbnailsStop = function animateThumbnailsStop()
{
	if (timer !== null)
	{
		clearTimeout(timer);
  		timer = null;	
	}
}

// Mostrar titulo al hacer hover sobre thumbnail
var thumbnailHoverIn = function thumbnailHoverIn(e)
{
	stopPropagation(e);
	var elTemp = null;
	if (e.currentTarget.children.length > 0)
	{
		// Buscar titulo del thumbnail
		for (var i = 0; i < e.currentTarget.children.length; i++)
		{
			var elTemp = $(e.currentTarget.children[i]);
			if (elTemp.is('div')) el = elTemp;
		}
	}

	// Aplicar propiedades al titulo
	if (elTemp !== null) elTemp.css("display", "flex").hide().fadeIn();
	elTemp = null;
};

// Esconder titulo al salir del thumbnail
var thumbnailHoverOut = function thumbnailHoverOut(e)
{
	stopPropagation(e);
	var elTemp = null;
	if (e.currentTarget.children.length > 0)
	{
		// Buscar titulo del thumbnail
		for (var i = 0; i < e.currentTarget.children.length; i++)
		{
			var elTemp = $(e.currentTarget.children[i]);
			if (elTemp.is('div')) el = elTemp;
		}
	}

	// Eliminar propiedades al titulo
	if (elTemp !== null) elTemp.fadeOut();
	elTemp = null;
};

// Generar Thumbnails
var createThumbnails = function createThumbnails(numberOfColumns)
{
	var works;

	// Generar lista de trabajos si hay filtro
	if (currentFilter === null) works = info_list['works'];
	else 
	{
		works = [];
		for (var i = 0; i < info_list['works'].length; i++)
		{
			if (info_list['works'][i]['category'] === currentFilter) 
				works.push(info_list['works'][i]);
		}
	}
	
	// Limpiar filas
	$('.row').remove();

	// Generar variables de conteo
	var container = $('#portfolio');
	var worksNumber = works.length;
	var worksContainer = 0;
	var rows = worksNumber / numberOfColumns;
	if (rows > parseInt(rows)) rows = parseInt(rows) + 1;

	for (var i = 0; i < rows; i++)
	{
		var row;
		var column = (worksNumber < numberOfColumns) ? worksNumber : numberOfColumns;
		var columns = worksContainer;

		// Generar fila de forma apropiada
		if (column === 3) row = $('<div>', {'class': 'row'});
		else if (column === 2) row = $('<div>', {'class': 'row two'});
		else row = $('<div>', {'class': 'row one'});

		for (var j = 0; j < column; j++)
		{
			var divThumb;
			var divThumbHTML = '';
			var columnInfo = works[j + columns];

			// Generar thumbnail con o sin animacion
			if (columnInfo['thumbnails'] > 0)
			{
				divThumb = $("<div>", {'class': 'thumbnail animate', 'data-animate': 0, 
					'data-folder': columnInfo['folder'], 'data-category': columnInfo['category']});
				for (var k = 1; k < columnInfo['thumbnails'] + 1; k++)
				{
					if (k === 1) divThumbHTML += '<img '; else divThumbHTML += '<img class="hid" ';
					divThumbHTML += 'src="img/' + columnInfo['category'] + '/' + columnInfo['folder'] + '/' +
						columnInfo['folder'] + '_thumb_' + k + '.jpg' + '" alt="Miniatura de ' + columnInfo['title'] + '"/>';
				}
			}
			else
			{
				divThumb = $("<div>", {'class': 'thumbnail', 'data-folder': columnInfo['folder'],
					'data-category': columnInfo['category']});
				divThumbHTML = '<img src="img/' + columnInfo['category'] + '/' + columnInfo['folder'] + '/' +
					columnInfo['folder'] + '_thumb.jpg' + '" alt="Miniatura de ' + columnInfo['title'] + '"/>';
			}

			// Generar titulo del thumbnail
			divThumbHTML += '<div class="title"><p>' + columnInfo['title'] + '</p></div>';
			divThumb.html(divThumbHTML);

			// Asignar hover al thumbnail
			divThumb.mouseenter(thumbnailHoverIn)
				.mouseleave(thumbnailHoverOut);

			// Asignar click al thumbnail
			divThumb.click(thumbnailClick);

			// Anadir thumbnail
			row.append(divThumb);
			worksContainer++;
		}
		container.append(row);
		worksNumber -= column;
	}
};
