import { Page } from '@nakedjsx/core/page'

Page.Create('en');
Page.AppendHead(<title>Overview | Iceland Trip</title>);
Page.AppendHead(<meta charset="UTF-8"></meta>);
Page.AppendHead(<meta name="viewport" content="width=device-width, initial-scale=1"></meta>);
Page.AppendBody(<h1>Hello World</h1>);
Page.AppendBody(<link rel="stylesheet" href={"/static/index.css?cb=" + Math.random()}></link>);
Page.Render('index.html');